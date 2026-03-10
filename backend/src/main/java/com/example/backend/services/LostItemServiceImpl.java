package com.example.backend.services;

import com.example.backend.dtos.LostItemRequestDto;
import com.example.backend.dtos.LostItemResponseDto;
import com.example.backend.models.ItemStatus;
import com.example.backend.models.LostItem;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.LostItemRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LostItemServiceImpl implements LostItemService {

    private final LostItemRepository lostItemRepository;
    private final UserRepository userRepository;

    @Autowired
    public LostItemServiceImpl(LostItemRepository lostItemRepository, UserRepository userRepository) {
        this.lostItemRepository = lostItemRepository;
        this.userRepository = userRepository;
    }

    // ── Role guard ───────────────────────────────────────────────────────────
    private User checkAdmin(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: ADMIN role required");
        }
        return user;
    }

    // ── Public operations ────────────────────────────────────────────────────

    @Override
    public LostItemResponseDto reportLostItem(LostItemRequestDto requestDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        LostItem item = new LostItem();
        item.setItemName(requestDto.getItemName());
        item.setDescription(requestDto.getDescription());
        item.setLocation(requestDto.getLocation());
        item.setDate(requestDto.getDate());
        item.setReportedBy(user);

        // Default to LOST; if type=="found" treat as FOUND (admin posting found item)
        if ("found".equalsIgnoreCase(requestDto.getType())) {
            item.setStatus(ItemStatus.FOUND);
            item.setFoundByUser(user);
            item.setFoundByName(user.getUsername());
        } else {
            item.setStatus(ItemStatus.LOST);
        }

        LostItem savedItem = lostItemRepository.save(item);
        return mapToDto(savedItem);
    }

    @Override
    public List<LostItemResponseDto> getAllLostItems() {
        return lostItemRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LostItemResponseDto> getReportedItemsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return lostItemRepository.findByReportedById(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LostItemResponseDto reportFoundItem(Long itemId, String adminUsername) {
        User admin = checkAdmin(adminUsername);

        LostItem item = lostItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        if (item.getStatus() != ItemStatus.LOST) {
            throw new RuntimeException("Item is not currently LOST (status: " + item.getStatus() + ")");
        }

        item.setStatus(ItemStatus.FOUND);
        item.setFoundByUser(admin);
        item.setFoundByName(admin.getUsername());

        return mapToDto(lostItemRepository.save(item));
    }

    @Override
    public LostItemResponseDto markAsClaimed(Long itemId, String adminUsername) {
        checkAdmin(adminUsername);

        LostItem item = lostItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        if (item.getStatus() != ItemStatus.FOUND) {
            throw new RuntimeException("Item must be FOUND before it can be CLAIMED (status: " + item.getStatus() + ")");
        }

        item.setStatus(ItemStatus.CLAIMED);
        return mapToDto(lostItemRepository.save(item));
    }

    @Override
    public LostItemResponseDto dispatchItem(Long itemId, String adminUsername) {
        checkAdmin(adminUsername);

        LostItem item = lostItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        if (item.getStatus() != ItemStatus.FOUND && item.getStatus() != ItemStatus.CLAIMED) {
            throw new RuntimeException("Only FOUND or CLAIMED items can be dispatched (status: " + item.getStatus() + ")");
        }

        item.setStatus(ItemStatus.DISPATCHED);
        item.setDispatch(true);
        return mapToDto(lostItemRepository.save(item));
    }

    // ── Mapper ───────────────────────────────────────────────────────────────

    private LostItemResponseDto mapToDto(LostItem item) {
        LostItemResponseDto dto = new LostItemResponseDto();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        dto.setLocation(item.getLocation());
        dto.setDate(item.getDate());
        dto.setStatus(item.getStatus());
        if (item.getReportedBy() != null) {
            dto.setReportedByUsername(item.getReportedBy().getUsername());
        }
        dto.setFoundByName(item.getFoundByName());
        dto.setDispatch(item.isDispatch());
        return dto;
    }
}
