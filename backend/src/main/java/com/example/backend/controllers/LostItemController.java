package com.example.backend.controllers;

import com.example.backend.dtos.LostItemRequestDto;
import com.example.backend.dtos.LostItemResponseDto;
import com.example.backend.services.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class LostItemController {

    private final LostItemService lostItemService;

    @Autowired
    public LostItemController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    @PostMapping("/report-lost")
    public ResponseEntity<?> reportLostItem(@RequestBody LostItemRequestDto requestDto,
            @RequestParam String username) {
        try {
            LostItemResponseDto item = lostItemService.reportLostItem(requestDto, username);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<LostItemResponseDto>> getAllLostItems() {
        return ResponseEntity.ok(lostItemService.getAllLostItems());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<LostItemResponseDto>> getUserReportedItems(@PathVariable String username) {
        return ResponseEntity.ok(lostItemService.getReportedItemsByUser(username));
    }

    /** ADMIN only — marks a LOST item as FOUND, records finder as the calling admin */
    @PostMapping("/{itemId}/report-found")
    public ResponseEntity<?> reportFoundItem(@PathVariable Long itemId,
            @RequestParam String username) {
        try {
            LostItemResponseDto item = lostItemService.reportFoundItem(itemId, username);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** ADMIN only — marks a FOUND item as CLAIMED */
    @PostMapping("/{itemId}/claim")
    public ResponseEntity<?> claimItem(@PathVariable Long itemId,
            @RequestParam String username) {
        try {
            LostItemResponseDto item = lostItemService.markAsClaimed(itemId, username);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** ADMIN only — dispatches a FOUND or CLAIMED item; sets is_dispatched = true */
    @PostMapping("/{itemId}/dispatch")
    public ResponseEntity<?> dispatchItem(@PathVariable Long itemId,
            @RequestParam String username) {
        try {
            LostItemResponseDto item = lostItemService.dispatchItem(itemId, username);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
